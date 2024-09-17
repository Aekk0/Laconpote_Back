// Import Third-party Dependencies
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

// Import Internals
import { role } from "./enum/role.enum";
import { Session } from "./session.entity";
import { Order } from "./order.entity";
import { Address } from "./address.entity";

@Unique("UQ_user_email", ["email"])
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("varchar")
    email: string;

    @Column("varchar")
    password: string;

    @Column("varchar")
    firstName: string;
    
    @Column("varchar")
    lastName: string;
    
    @Column("enum", { enum: role, default: role.user })
    role: role;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("timestamp", { nullable: true })
    emailVerified: string;

    // RELATIONS
    @OneToOne(() => Session, (table) => table.user, { nullable: true })
    session: Session;

    @OneToMany(() => Order, (table) => table.user, { nullable: true })
    orders: Order[];

    @OneToMany(() => Address, (table) => table.user, { nullable: true })
    addresses: Address[];
}