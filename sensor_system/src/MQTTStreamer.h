#pragma once
#include <string>
#include "mqtt/async_client.h"

class MQTTStreamer
{
public:
    MQTTStreamer(const std::string &broker, const std::string &cid);
    bool connect();
    void disconnect();
    bool publish(const std::string &topic, const std::string &msg);

private:
    mqtt::async_client client;
    bool connected;
};
