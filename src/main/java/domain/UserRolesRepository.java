package domain;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRolesRepository extends CrudRepository<UserRole, Long> {
	
	@Query("select a.role from UserRole a, User b where b.userName=?1 and a.userid=b.userId")
    public List<String> findRoleByUserName(String username);
	
	@Query("select a from UserRole a where a.userid=?1")
    public List<UserRole> findRoleId(long userid);
	
    @Query("select a from UserRole a where a.role='ROLE_ADMIN'")
	public Iterable<UserRole> findAllAdminRoles();
	
	@Transactional
	@Modifying
	@Query("delete from UserRole u where u.userid=?1")
	public void deleteByUserId(long userid);
}