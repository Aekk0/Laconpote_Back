// Import Third-party Dependencies
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { Order } from "./order.entity";

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { array: true, nullable: false })
    price: number[];

    @Column("varchar")
    name: string;

    @OneToMany(() => Order, (table) => table.address, { nullable: true })
    orders: Order[];
}