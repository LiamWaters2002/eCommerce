﻿using Microsoft.AspNetCore.Identity;

namespace eCommerceWebsite.Models
{
    public class Users : IdentityUser
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}
