using Wagr.Domain.Interfaces;
using Wagr.Domain.Interfaces.Commands;
using Wagr.Domain.Models.DTO;
using Wagr.Domain.Models.Requests;
using Wagr.Domain.Models.Responses;

namespace Wagr.Application.Commands
{
    public class PaymentsCommand : IPaymentsCommand
    {
        private readonly ICirclePaymentsRepo _circlePaymentsRepo;

        public PaymentsCommand(ICirclePaymentsRepo circlePaymentsRepo)
        {
            _circlePaymentsRepo = circlePaymentsRepo;
        }

        public async Task<CircleCreateCardResponse> AddNewPayment(CreatePaymentMethodDto dto)
        {
            var request = MapDtoToRequest(dto);
            return await _circlePaymentsRepo.CreateNewPayment(request);
        }

        private CircleCreateCardRequest MapDtoToRequest(CreatePaymentMethodDto dto)
        {
            return new CircleCreateCardRequest
            {
                IdempotencyKey = Guid.NewGuid().ToString(),
                KeyId = dto.EncryptedData.KeyId,
                ExpirationMonth = dto.ExpirationMonth,
                ExpirationYear = dto.ExpirationYear,
                BillingDetails = new CircleCreateCardBillingDetails
                {
                    AddressLine1 = dto.Address.Address1,
                    AddressLine2 = dto.Address.Address2,
                    City = dto.Address.City,
                    District = dto.Address.District,
                    Country = dto.Address.Country,
                    PostalCode = dto.Address.PostalCode,
                    Name = dto.Name
                },
                Metadata = new CircleCreatePaymentMetadata
                {
                    PhoneNumber = "+1"+dto.PhoneNumber.Replace("(", "").Replace(")", "").Replace("-", ""),
                    Email = dto.Email,
                    SessionId = "yyyyWillFigureOutLaterzzz",
                    IpAddress = "172.22.222.1"//dto.IpAddress
                },
                EncryptedData = dto.EncryptedData.EncryptedData
            };
        }
    }
}
