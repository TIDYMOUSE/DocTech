//package com.example.DocTech.Config;
//
//import com.example.DocTech.Service.MQTTService;
//import com.example.DocTech.Util.CSVREADER;
//import com.example.DocTech.Websocket.MedConnectSocketHandler;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//
//@Configuration
//@EnableWebSocket
//public class WebsocketConfig implements WebSocketConfigurer {
//
//    private final CSVREADER csvreader;
//    private final MQTTService mqttService;
//
//    public WebsocketConfig(CSVREADER csvreader, MQTTService mqttService, MedConnectSocketHandler medConnectSocketHandler) {
//        this.csvreader = csvreader;
//        this.mqttService = mqttService;
//
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(myHandler(), "/connect").setAllowedOrigins("*");
//    }
//
//    @Bean
//    public WebSocketHandler myHandler() {
//        return new MedConnectSocketHandler(csvreader, mqttService);
//    }
//}
