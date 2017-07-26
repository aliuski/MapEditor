package config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ConfigData {
    private final String directory;

    @Autowired
    public ConfigData(@Value("${mapeditor.directory}") String directory) {
        this.directory = directory;
//        System.out.println(" ================== " + directory + "================== ");
    }
    
    public String getDirectory(){
    	return directory;
    }
}
