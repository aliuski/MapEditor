package domain;

public class UserInfo {
	private Long userId;
	private String userName;
	private String email;
	private String password;
	private boolean adminRole;
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public boolean isAdminRole() {
		return adminRole;
	}
	public void setAdminRole(boolean adminRole) {
		this.adminRole = adminRole;
	}
}
