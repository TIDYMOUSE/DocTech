#include "CSVReader.h"
#include <sstream>
#include <iostream>
#include <fstream>

CSVReader::CSVReader(const std::string &filename) : file(filename) {}

bool CSVReader::open() { return file.is_open(); }
void CSVReader::close()
{
    if (file.is_open())
        file.close();
}
bool CSVReader::hasMoreData() { return file && !file.eof(); }

CSVECGData CSVReader::readNextRecord()
{
    CSVECGData data{};
    data.isValid = false;

    std::string line;
    if (!std::getline(file, line))
        return data;

    std::istringstream ss(line);
    std::string token;
    std::vector<std::string> parts;

    while (std::getline(ss, token, ','))
    {
        parts.push_back(token);
    }

    // Expected 21 columns
    if (parts.size() != 20)
    {
        std::cerr << "⚠️ CSV parsing warning: expected 20 columns but got " << parts.size() << std::endl;
        return data;
    }

    try
    {
        data.timestamp = parts[0];
        data.heart_rate = std::stoi(parts[1]);
        data.bp_systolic = std::stoi(parts[2]);
        data.bp_diastolic = std::stoi(parts[3]);
        data.respiratory_rate = std::stoi(parts[4]);
        data.body_temperature = std::stod(parts[5]);
        data.oxygen_saturation = std::stoi(parts[6]);

        for (int i = 0; i < 10; ++i)
        {
            data.ecg[i] = std::stod(parts[7 + i]);
        }

        data.activity_level = parts[17];
        data.stress_level = std::stoi(parts[18]);
        data.sleep_duration = std::stod(parts[19]);

        data.isValid = true;
    }
    catch (const std::exception &e)
    {
        std::cerr << "❌ CSV parsing error: " << e.what() << std::endl;
    }

    return data;
}

std::string CSVECGData::toJson() const
{
    std::ostringstream ss;
    ss << "{";
    ss << "\"timestamp\":\"" << timestamp << "\",";
    ss << "\"heart_rate\":" << heart_rate << ",";
    ss << "\"bp_systolic\":" << bp_systolic << ",";
    ss << "\"bp_diastolic\":" << bp_diastolic << ",";
    ss << "\"respiratory_rate\":" << respiratory_rate << ",";
    ss << "\"body_temperature\":" << body_temperature << ",";
    ss << "\"oxygen_saturation\":" << oxygen_saturation << ",";
    ss << "\"ecg\":[";
    for (int i = 0; i < 10; ++i)
    {
        ss << ecg[i];
        if (i < 9)
            ss << ",";
    }
    ss << "],";
    ss << "\"activity_level\":\"" << activity_level << "\",";
    ss << "\"stress_level\":" << stress_level << ",";
    ss << "\"sleep_duration\":" << sleep_duration;
    ss << "}";
    return ss.str();
}

void CSVReader::createSampleCSV()
{
    std::ofstream file("data/data.csv");
    if (!file.is_open())
    {
        std::cerr << "❌ Failed to create sample CSV file" << std::endl;
        return;
    }

    // Write the CSV header matching your columns
    file << "timestamp,heart_rate,bp_systolic,bp_diastolic,respiratory_rate,body_temperature,oxygen_saturation,"
            "ecg_1,ecg_2,ecg_3,ecg_4,ecg_5,ecg_6,ecg_7,ecg_8,ecg_9,ecg_10,"
            "activity_level,stress_level,sleep_duration\n";

    // Write some sample data rows (you can add more)
    file << "2025-01-17T15:51:47.962,90,103,71,20,38,97,"
            "0.485,-0.088,0.025,-0.491,-0.328,-0.335,-0.353,-0.012,-0.317,-0.127,"
            "low,3,7.6\n";
    file << "2025-01-17T15:51:48.962,74,95,79,20,36.8,100,"
            "0.398,-0.26,-0.253,0.135,-0.209,0.229,0.429,-0.475,0.075,0.053,"
            "medium,8,5.2\n";

    file.close();
    std::cout << "✅ Sample CSV file created at data/ecg_data.csv" << std::endl;
}

void CSVReader::skipHeader()
{
    std::string header;
    std::getline(file, header);
}
