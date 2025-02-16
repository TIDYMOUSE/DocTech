//package com.example.DocTech.Websocket;
//
//import com.example.DocTech.Service.MQTTService;
//import com.example.DocTech.Util.CSVREADER;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.io.IOException;
//
//@Component
//public class MedConnectSocketHandler extends TextWebSocketHandler {
//
//    private final CSVREADER csvreader;
//    private final MQTTService mqttService;
//
//    public MedConnectSocketHandler(CSVREADER csvreader, MQTTService mqttService) {
//        this.csvreader = csvreader;
//        this.mqttService = mqttService;
//    }
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        System.out.println("CONNECTED TO :--------->");
//        System.out.println("LOCAL ADDRESS: " +  session.getLocalAddress());
//        System.out.println("REMOTE ADDRESS: " +  session.getRemoteAddress());
//
//        mqttService.startListening();
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        System.out.println("CONNECTED CLOSED :--------->");
//        System.out.println("LOCAL ADDRESS: " +  session.getLocalAddress());
//        System.out.println("REMOTE ADDRESS: " +  session.getRemoteAddress());
//
//        mqttService.stopListening();
//    }
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
//
//        session.sendMessage(new TextMessage("RECEIVED MESSAGE: " + message.getPayload()));
//
//        mqttService.sentToMqtt(message.getPayload(), "monitor/ecg");
//
//    }
//
//
//}
