export class User {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
    public readonly userId: string,
  ) {}
}
