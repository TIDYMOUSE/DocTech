package com.example.DocTech.Util;


import com.example.DocTech.Service.MQTTService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.StandardCharsets;

@Component
public class CSVREADER {

    private  final ResourceLoader resourceLoader;
    private MQTTService mqttService;

    public CSVREADER(ResourceLoader resourceLoader, MQTTService mqttService) {
        this.resourceLoader = resourceLoader;
        this.mqttService = mqttService;
    }

    public void getData(String columnName) {
        Resource resource = resourceLoader.getResource("classpath:csv/data.csv");

        if(!resource.exists()) {
            System.out.println("CSV NOT FOUND");
            return;
        }
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = bufferedReader.readLine();
            String[] headers = headerLine.split(",");
            int columnIndex = -1;

            for(int i = 0; i < headers.length; i++){
                if(headers[i].trim().equals(columnName)){
                    columnIndex = i;
                    break;
                }
            }

            if(columnIndex == -1) {
                System.out.println("COLUMNS NOT FOUND");
                return;
            }

            String line;
            while((line = bufferedReader.readLine()) != null){
                String[] values = line.split(",");
                String dataValue = values[columnIndex];
//                mqttService.sentToMqtt(dataValue, "/" + columnName);
                System.out.println(dataValue);
            }
        } catch (IOException e){
            e.printStackTrace();
        }

    }
}
