namespace eCommerceWebsite.Models
{
    public class Items
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }
        public int Status { get; set; }
    }
}
