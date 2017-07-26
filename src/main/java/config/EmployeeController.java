package config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import domain.Locations;
import domain.LocationsDAO;
import domain.User;
import domain.UserInfo;
import domain.UserRepository;
import domain.UserRole;
import domain.UserRolesRepository;

@RestController
public class EmployeeController {
	
	@Autowired
	private ConfigData configdata;
		
	@Autowired
	private LocationsDAO locationsDAO;
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserRolesRepository userRolesRepository;
	
	
	@RequestMapping("/kaikkipaikat")
    public @ResponseBody Iterable<Locations> kaikkipaikat(){
    	return locationsDAO.findAll();
    }
	
	@RequestMapping("/locationsday")
    public @ResponseBody List<String> locationsday(){
    	return locationsDAO.findLocationsDates();
    }
/*
	@RequestMapping("/locations")
	public @ResponseBody List<Locations> locations(@RequestParam("lon") int lon,@RequestParam("lat") int lat,@RequestParam("size") int size){
		size*=2;
		return locationsDAO.findLocations(lon,lat,lon+size,lat-size);
	}
*/
	@RequestMapping("/locations")
	public @ResponseBody List<Locations> locations(
			@RequestParam("lon") int lon,@RequestParam("lat") int lat,@RequestParam("size") int size,
			@RequestParam("dates") String dstr){
		size*=2;
		if(dstr.isEmpty())
			return locationsDAO.findLocations(lon,lat,lon+size,lat-size);
		java.sql.Date dates = java.sql.Date.valueOf(dstr);
		Date enddates = new Date(dates.getTime()+86399000);
		return locationsDAO.findLocationsAndDates(lon,lat,lon+size,lat-size,dates,enddates);
	}
	
    @RequestMapping(value = "/deletelocations", method = RequestMethod.DELETE)
    public Map<String, String> deleteUser(@RequestBody String strlist) {
    	String list[] = strlist.split(",");
    	for(int i=0;i<list.length;i++){
    		Date d = new Date(Long.valueOf(list[i]));
    		locationsDAO.delete(d);
    	}
 
        return Collections.singletonMap("message", "OK");
    }

	@RequestMapping(value = "/karttaainesto/{id}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody
    byte[] showImage(@PathVariable String id) {		
        Path path = Paths.get(configdata.getDirectory()+id+".png");
        byte[] array = null;
        try{
        	array = Files.readAllBytes(path);
        }catch(Exception e){
        };
        return array;
    }
		
    @RequestMapping("/users")
    public @ResponseBody List<UserInfo> allusers(){    	
    	List<UserInfo> l = new ArrayList<UserInfo>();
    	Iterable<UserRole> userroles = userRolesRepository.findAllAdminRoles();
    	for (User user : userRepository.findAll()) {
    		UserInfo userinfo = new UserInfo();
    		userinfo.setUserId(user.getUserid());
    		userinfo.setUserName(user.getUserName());
    		userinfo.setEmail(user.getEmail());
    		userinfo.setAdminRole(false);
        	for (UserRole userrole : userroles) {
        		if(user.getUserid() == userrole.getUserid())
        			userinfo.setAdminRole(true);
        	}
        	l.add(userinfo);
    	}
    	return l;
    }
    
	@RequestMapping(value = "/edituser", method = RequestMethod.PUT)
    public Map<String, String> editUser(@RequestBody UserInfo ui) {
		
    	BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    	User u = new User();
    	u.setUserid(ui.getUserId());
    	u.setUserName(ui.getUserName());
    	u.setPassword(passwordEncoder.encode(ui.getPassword()));
    	u.setEmail(ui.getEmail());
    	u.setEnabled(1);
		User newid = userRepository.save(u);

		UserRole ur;
		if(u.getUserid() == 0){
			ur = new UserRole();
			ur.setUserid(newid.getUserid());
			ur.setRole("ROLE_USER");
			userRolesRepository.save(ur);
			if(ui.isAdminRole()){
				ur = new UserRole();
				ur.setUserid(newid.getUserid());
				ur.setRole("ROLE_ADMIN");
				userRolesRepository.save(ur);
			}
		} else {
			boolean find = false;
			List<UserRole> lur = userRolesRepository.findRoleId(ui.getUserId());
			for (UserRole urt : lur) {
				if(urt.getRole().equals("ROLE_ADMIN")){
					find = true;
					if(!ui.isAdminRole())
						userRolesRepository.delete(urt.getUserroleid());
				}
			}
			if(!find && ui.isAdminRole()){
				ur = new UserRole();
				ur.setUserid(newid.getUserid());
				ur.setRole("ROLE_ADMIN");
				userRolesRepository.save(ur);
			}
		}
		
        return Collections.singletonMap("message", "OK");
    }
    
    @RequestMapping(value = "/deleteuser", method = RequestMethod.DELETE)
    public Map<String, String> deleteUser(long id) {
    	delete_data(id);
        return Collections.singletonMap("message", "OK");
    }
    
    @Transactional
    private void delete_data(long id){
    	userRolesRepository.deleteByUserId(id);
    	userRepository.delete(id);
    }
}
