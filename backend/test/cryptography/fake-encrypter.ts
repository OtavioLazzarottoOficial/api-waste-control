import { Encrypter } from '@/domain/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypty(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
