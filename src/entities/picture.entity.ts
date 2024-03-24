// Import Third-party Dependencies
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

// Import Internals
import { Product } from "./product.entity";

// @Unique("UQ_user_email", ["email"])
@Entity()
export class Picture {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("varchar")
    base64: string;

    @Column("varchar", { nullable: true })
    description: string;

    // RELATIONS
    @ManyToOne(() => Product, (product) => product.pictures)
    @JoinColumn({ name: "product_id"})
    product: Product;

    @Column("varchar")
    productId: string;

}