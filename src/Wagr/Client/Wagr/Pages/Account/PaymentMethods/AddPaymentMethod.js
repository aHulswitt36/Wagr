//import { createMessage, encrypt, readKey } from 'openpgp';
//export async function encryptCardData(publicKey, cardNumber, cvv) {
//    const decodedPublicKey = await readKey({ armoredKey: atob(publicKey.data.publicKey) });
//    const cardDetails = {
//        number: cardNumber,
//        cvv: cvv
//    };
//    const message = await createMessage({ text: JSON.stringify(cardDetails) });
//    return encrypt({
//        message,
//        encryptionKeys: decodedPublicKey
//    }).then((ciphertext) => {
//        return {
//            encryptedData: btoa(ciphertext),
//            keyId: publicKey.data.keyId
//        };
//    });
//}
////# sourceMappingURL=AddPaymentMethod.js.map
