// Import Third-party Dependencies
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";
import { Order } from "./order.entity";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("integer")
    number: number;

    @Column("varchar")
    street: string;

    @Column("varchar", { nullable: true })
    complement?: string;

    @Column("varchar")
    city: string;

    @Column("varchar")
    ZIPCode: string;

    @Column("varchar")
    phone: string;

    // FK
    @ManyToOne(() => User, (table) => table.addresses, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;
    @Column("int", { nullable: false })
    userId: number;

    @OneToMany(() => Order, (table) => table.address, { nullable: true })
    orders: Order[];
}