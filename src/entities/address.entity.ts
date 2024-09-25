// Import Third-party Dependencies
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";
import { Order } from "./order.entity";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer")
    number: number;

    @Column("varchar")
    street: string;

    @Column("varchar")
    city: string;

    @Column("varchar")
    ZIPCode: string;

    @Column("varchar")
    phone: string;

    @Column("varchar", { nullable: true })
    complement?: string;

    // FK
    @ManyToOne(() => User, (table) => table.addresses, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;
    @Column("integer", { nullable: false })
    user_id: number;

    @OneToMany(() => Order, (table) => table.address, { nullable: true })
    orders: Order[];
}