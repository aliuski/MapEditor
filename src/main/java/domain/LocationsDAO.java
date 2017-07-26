package domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface LocationsDAO extends CrudRepository<Locations, Date>{
	
	@Query("select date(a.dates) from Locations a group by date(a.dates)")
    public List<String> findLocationsDates();
	
	@Query("select a from Locations a where a.lon>?1 and a.lat<?2 and a.lon<?3 and a.lat>?4")
    public List<Locations> findLocations(int lon1,int lat1,int lon2,int lat2);
	
	@Query("select a from Locations a where a.lon>?1 and a.lat<?2 and a.lon<?3 and a.lat>?4 and dates>?5 and dates<?6")
    public List<Locations> findLocationsAndDates(int lon1,int lat1,int lon2,int lat2,Date start,Date stop);
}