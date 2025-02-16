package com.example.DocTech.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;


@Controller
public class STOMPController {

    @MessageMapping("/ecg")
    public String recv(String data) {
        System.out.println("hueue: " + data);
//        mqttService.sentToMqtt(data, "/ecg");

        return "sent from backend: " + data;
    }
}
