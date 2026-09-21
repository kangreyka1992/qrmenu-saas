declare module 'robokassa-gate' {
  interface RoboGateConfig {
    merchantLogin: string;
    hashingAlgorithm: 'md5' | 'sha1' | 'sha256' | 'sha512';
    password1: string;
    password2: string;
    testMode?: boolean;
    testPassword1?: string;
    testPassword2?: string;
    resultUrlRequestMethod?: 'GET' | 'POST';
  }

  interface PaymentParams {
    invId: string | number;
    invSumm: string | number;
    invDescr?: string;
    email?: string;
  }

  export default class RoboGate {
    constructor(config: RoboGateConfig);
    generatePaymentURL(params: PaymentParams): string;
    validateResult(req: any): boolean;
  }
}