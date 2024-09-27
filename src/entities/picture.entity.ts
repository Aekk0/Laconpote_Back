// Import Third-party Dependencies
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { Product } from "./product.entity";

@Entity()
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    base64: string;

    @Column("varchar", { nullable: true })
    description: string;

    // RELATIONS
    @ManyToOne(() => Product, (product) => product.pictures, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id"})
    product: Product;
}