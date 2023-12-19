using Microsoft.AspNetCore.Identity;

namespace eCommerceWebsite.Models
{
    public class UserDetails : IdentityUser
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}
