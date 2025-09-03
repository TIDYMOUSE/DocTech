#pragma once
#include <fstream>
#include <string>
#include <vector>

struct CSVECGData
{
    std::string timestamp; // ISO-8601 string
    int heart_rate;
    int bp_systolic;
    int bp_diastolic;
    int respiratory_rate;
    double body_temperature;
    int oxygen_saturation;
    double ecg[10]; // ecg_1 to ecg_10
    std::string activity_level;
    int stress_level;
    double sleep_duration;

    bool isValid;

    std::string toJson() const;
};

class CSVReader
{
public:
    CSVReader(const std::string &filename);
    bool open();
    void close();
    CSVECGData readNextRecord();
    bool hasMoreData();
    void skipHeader();
    static void createSampleCSV(); // Optional, you can implement this to create sample CSV file
private:
    std::ifstream file;
};
