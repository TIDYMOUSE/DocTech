package com.example.DocTech.Config;

//import com.example.DocTech.Websocket.MedConnectSocketHandler;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Configuration
public class MQTTConfig {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    MQTTConfig(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }


    @Bean
    public MqttPahoClientFactory mqttPahoClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
//        options.setServerURIs(new String[] {"tcp://localhost:1883", "ssl://localhost:8883"});
        options.setServerURIs(new String[] {this.brokerUrl});
        options.setUserName(this.username);
        options.setPassword(this.password.toCharArray());
        options.setCleanSession(true);
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

//    @Bean
//    public MessageChannel mqttOutputChannel() {return new DirectChannel();}

    @Bean
    public MqttPahoMessageDrivenChannelAdapter inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter(this.brokerUrl, this.clientId + "_in", mqttPahoClientFactory(),
                "monitor/ecg", "monitor/blood_pressure", "monitor/heart_rate", "monitor/body_temperature", "monitor/stress_level", "monitor/activity_level");
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setAutoStartup(false);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }



    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler inboundMessageHandler() {
        return new MessageHandler() {
            @Override
            public void handleMessage(Message<?> message) throws MessagingException {
            System.out.println("=============== MQTT MESSAGE RECEIVED ===============");
            System.out.println("Payload: {}" + message.getPayload());
            System.out.println("Headers: {}" + message.getHeaders());
            System.out.println("==================================================");

//            medConnectSocketHandler.handleMessage();
            simpMessagingTemplate.convertAndSend("/queue/ecg",message.getPayload() + " FROM MQTT");

            }
        };
    }

//    @Bean
//    @ServiceActivator(inputChannel = "mqttOutputChannel")
//    public MessageHandler outgoingMessageHandler() {
//        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler(this.brokerUrl, this.clientId + "_out", mqttPahoClientFactory());
//        messageHandler.setAsync(true);
//        messageHandler.setDefaultTopic(DEFAULT_TOPIC);
//        messageHandler.setDefaultQos(1);
//        return messageHandler;
//    }

//    @MessagingGateway(defaultRequestChannel = "mqttOutputChannel")
//    public interface MQTTGateway {
//        void sentToMqtt (String message, String topic);
//    }


}
