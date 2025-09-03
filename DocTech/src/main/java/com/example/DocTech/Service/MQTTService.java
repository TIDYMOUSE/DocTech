package com.example.DocTech.Service;

import com.example.DocTech.Config.MQTTConfig;
import com.example.DocTech.Util.CSVREADER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
//public class MQTTService implements MQTTConfig.MQTTGateway {
public class MQTTService  {

//    private final MessageChannel mqttOutputChannel;
    private final MqttPahoMessageDrivenChannelAdapter inboundAdapter;


    public MQTTService(MqttPahoMessageDrivenChannelAdapter messageDrivenChannelAdapter) {
//        this.mqttOutputChannel = mqttOutputChannel;
        this.inboundAdapter = messageDrivenChannelAdapter;
    }

    public void startListening() {
        if(!inboundAdapter.isActive()){
            inboundAdapter.start();
            System.out.println("---------------MQTT STARTED LISTENING----------------");
        } else {
            System.out.println("---------------MQTT ALREADY LISTENING----------------");
        }
    }
    public void stopListening() {
        if(inboundAdapter.isActive()){
            inboundAdapter.stop();
            System.out.println("---------------MQTT STOPPED LISTENING----------------");
        } else {
            System.out.println("---------------MQTT ALREADY NOT LISTENING----------------");
        }
    }
    private Message<String> createMessage(String payload, String topic) {
        return MessageBuilder.withPayload(payload).setHeader(MqttHeaders.TOPIC, topic).build();
    }

//    @Override
//    public void sentToMqtt(String message, String topic) {
////        System.out.println("FROM MQTT SERVICE: " + message + " " +topic);
////        try {
////            mqttOutputChannel.send(createMessage(message, topic));
////
////        } catch (Exception e) {
////            System.err.println("Failed to publish message: " + e);
////            e.printStackTrace();
////        }
//    }
}
