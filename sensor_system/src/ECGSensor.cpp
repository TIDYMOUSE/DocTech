#include "ECGSensor.h"
#include <sstream>
#include <chrono>
#include <cmath>

ECGSensor::ECGSensor(double sampleRate)
{}

bool ECGSensor::initialize() { return true; }

ECGReading ECGSensor::readSingleSample() {
    auto now = std::chrono::system_clock::now();
    double ts = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()).count() / 1000.0;
    // Simulate values
    ECGReading r{1.6 + 0.1 * (rand() % 10), 70 + rand() % 10, ts, "Lead II", true};
    return r;
}
void ECGSensor::disconnect() {}
bool ECGSensor::isReady() const { return true; }

std::string ECGReading::toJson() const {
    std::ostringstream ss;
    ss << "{";
    ss << "\"voltage\":" << voltage << ",";
    ss << "\"heartRate\":" << heartRate << ",";
    ss << "\"timestamp\":" << timestamp << ",";
    ss << "\"leadType\":\"" << leadType << "\",";
    ss << "\"isValid\":" << (isValid ? "true" : "false");
    ss << "}";
    return ss.str();
}

