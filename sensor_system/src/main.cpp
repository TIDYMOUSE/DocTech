#include <iostream>
#include <thread>
#include <chrono>
#include "ECGSensor.h"
#include "CSVReader.h"
#include "MQTTStreamer.h"
#include <unordered_map>

const std::string baseTopic = "monitor/";

void ecgThread(const std::string &filename)
{
    CSVReader csv(filename);

    if (!csv.open())
    {
        std::cerr << "Failed to open CSV file" << std::endl;
        return;
    }

    csv.skipHeader();

    MQTTStreamer mqtt("tcp://localhost:1883", "ECG");

    try
    {
        mqtt.connect();
    }
    catch (const mqtt::exception &e)
    {
        std::cerr << "MQTT connect failed: " << e.what() << std::endl;
        return;
    }

    while (csv.hasMoreData())
    {
        CSVECGData data = csv.readNextRecord();
        if (!data.isValid)
            break;

        std::string payload = "{ \"time\": \"" + data.timestamp + "\", \"value\": " + std::to_string(data.ecg[0]) + " }";
        mqtt.publish(baseTopic + "ecg1", payload);

        std::this_thread::sleep_for(std::chrono::seconds(2)); // stream at desired interval
    }

    csv.close();
    mqtt.disconnect();
}

void bpThread(const std::string &filename)
{
    CSVReader csv(filename);

    if (!csv.open())
    {
        std::cerr << "Failed to open CSV file" << std::endl;
        return;
    }

    csv.skipHeader();

    MQTTStreamer mqtt("tcp://localhost:1883", "BP");

    try
    {
        mqtt.connect();
    }
    catch (const mqtt::exception &e)
    {
        std::cerr << "MQTT connect failed: " << e.what() << std::endl;
        return;
    }

    while (csv.hasMoreData())
    {
        CSVECGData data = csv.readNextRecord();
        if (!data.isValid)
            break;

        std::string payload = "{ \"time\": \"" + data.timestamp + "\", \"systolic\": " +
                              std::to_string(data.bp_systolic) +
                              ", \"diastolic\": " + std::to_string(data.bp_diastolic) + " }";
        mqtt.publish(baseTopic + "bp", payload);

        std::this_thread::sleep_for(std::chrono::milliseconds(500)); // simulate slower BP
    }
}

int main()
{
    std::cout << "Start ECG IoT Device!\n";
    std::cout << "1 = Simulated sensor stream | 2 = CSV stream | 3 = Create sample CSV | 4 = REAL |5 = Exit\n> ";
    int opt;
    std::cin >> opt;

    if (opt == 1)
    {
        ECGSensor sensor;
        sensor.initialize();
        MQTTStreamer mqtt("tcp://broker.emqx.io:1883", "ECGSensorClient");
        if (!mqtt.connect())
        {
            std::cout << "MQTT connect error\n";
            return 1;
        }
        for (int i = 0; i < 5; ++i)
        {
            auto d = sensor.readSingleSample();
            mqtt.publish("test/ecg/device1", d.toJson());
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
        mqtt.disconnect();
        sensor.disconnect();
    }
    else if (opt == 2)
    {

        CSVReader csv("../data/data.csv");

        if (!csv.open())
        {
            std::cerr << "Failed to open CSV file" << std::endl;
            return 1;
        }

        csv.skipHeader();

        MQTTStreamer mqtt("tcp://localhost:1883", "Monitor");

        if (!mqtt.connect())
        {
            std::cerr << "Failed to connect MQTT broker" << std::endl;
            return 1;
        }

        while (csv.hasMoreData())
        {
            CSVECGData data = csv.readNextRecord();
            if (!data.isValid)
                break;

            std::string baseTopic = "monitor/";
            mqtt.publish(baseTopic + "ecg1", std::to_string(data.ecg[0]));
            mqtt.publish(baseTopic + "bp/systolic", std::to_string(data.bp_systolic));

            std::this_thread::sleep_for(std::chrono::seconds(2)); // stream at desired interval
        }

        csv.close();
        mqtt.disconnect();
    }
    else if (opt == 3)
    {
        CSVReader::createSampleCSV();
        std::cout << "Sample CSV written to data/ecg_data.csv\n";
    }
    else if (opt == 4)
    {
        // Copy the data.csv for each thread
        std::string ecgFile = "../data/ecg_data.csv";
        std::string bpFile = "../data/bp_data.csv";
        std::string original = "../data/data.csv";

        // Copy original CSV to two separate files
        std::ifstream src(original, std::ios::binary);
        std::ofstream dst1(ecgFile, std::ios::binary);
        std::ofstream dst2(bpFile, std::ios::binary);
        dst1 << src.rdbuf();
        src.clear();  // Reset the stream state
        src.seekg(0); // Rewind
        dst2 << src.rdbuf();

        // Now launch threads with separate file streams
        std::thread t1(ecgThread, ecgFile);
        std::thread t2(bpThread, bpFile);
        t1.join();
        t2.join();
    }
    std::cout << "Done.\n";
}
