cmake_minimum_required(VERSION 3.1)
project(DocTech)
set(CMAKE_CXX_STANDARD 17)

include_directories(src)
find_package(PahoMqttCpp REQUIRED)

add_executable(ecg_device
	src/main.cpp
	src/ECGSensor.cpp
	src/CSVReader.cpp
	src/MQTTStreamer.cpp
)

target_link_libraries(ecg_device PRIVATE
	PahoMqttCpp::paho-mqttpp3
)


