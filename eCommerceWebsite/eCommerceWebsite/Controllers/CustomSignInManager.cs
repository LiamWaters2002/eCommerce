using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;


namespace eCommerceWebsite.Controllers
{
    public class CustomSignInManager : SignInManager<IdentityUser>
    {
        // Constructor for the custom SignInManager
        public CustomSignInManager(
            UserManager<IdentityUser> userManager,
            IHttpContextAccessor contextAccessor,
            IUserClaimsPrincipalFactory<IdentityUser> claimsFactory,
            IOptions<IdentityOptions> optionsAccessor,
            ILogger<CustomSignInManager> logger,
            IAuthenticationSchemeProvider schemes,
            IUserConfirmation<IdentityUser> confirmation)
            : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
        {
        }

        // Override the SignInAsync method
        public override async Task SignInAsync(IdentityUser user, AuthenticationProperties authenticationProperties, string authenticationMethod = null)
        {
            // Create a claims principal for the user
            var principal = await CreateUserPrincipalAsync(user);

            // Check if authenticationProperties is not null
            if (authenticationProperties is not null)
            {
                // Iterate through the claims in the principal and add them to the authenticationProperties
                foreach (var claim in principal.Claims)
                {
                    authenticationProperties.Items.Add(claim.Type, claim.Value);
                }
            }

            // Sign in the user using the provided principal and authentication properties
            await Context.SignInAsync(IdentityConstants.ApplicationScheme, principal, authenticationProperties);
        }
    }
}
