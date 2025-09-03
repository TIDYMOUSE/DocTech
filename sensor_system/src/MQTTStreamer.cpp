#include "MQTTStreamer.h"
#include <iostream>

MQTTStreamer::MQTTStreamer(const std::string &broker, const std::string &cid)
    : client(broker, cid), connected(false) {}

bool MQTTStreamer::connect()
{
    try
    {
        mqtt::connect_options opts;
        opts.set_user_name("advait");
        opts.set_password("Advait08");
        client.connect(opts)->wait();
        connected = true;
        return true;
    }
    catch (const mqtt::exception &e)
    {
        std::cerr << e.what() << std::endl;
        return false;
    }
}

void MQTTStreamer::disconnect()
{
    if (!connected)
        return;
    client.disconnect()->wait();
    connected = false;
}

bool MQTTStreamer::publish(const std::string &topic, const std::string &msg)
{
    if (!connected)
        return false;
    client.publish(topic, msg.c_str(), msg.length(), 1, false);
    return true;
}
