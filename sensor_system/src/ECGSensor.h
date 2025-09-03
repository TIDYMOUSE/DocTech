#pragma once
#include <string>
#include <vector>

struct ECGReading {
	double voltage;
	int heartRate;
	double timestamp;
	std:: string leadType;
	bool isValid;
	std::string toJson() const;
};

class ECGSensor {
	public: 
		ECGSensor(double sampleRate = 1000.0);
		bool initialize();
		ECGReading readSingleSample();
		void disconnect();
		bool isReady() const;
};
