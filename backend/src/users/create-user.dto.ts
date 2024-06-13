// create-user.dto.ts
export class CreateUserDto {
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly address?: string;
  readonly postalcode?: string;
  readonly phone1?: string;
  readonly phone2?: string;
  readonly especialidad?: string;
  readonly startDate?: Date;
  readonly isActive?: boolean;
}
