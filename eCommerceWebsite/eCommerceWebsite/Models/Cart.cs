namespace eCommerceWebsite.Models
{
    public class Cart
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int ItemID { get; set; }
        public int Quantity { get; set; }
    }
}
