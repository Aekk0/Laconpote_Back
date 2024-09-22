// Import Third-party Dependencies
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("boolean", { default: false })
    refresh: boolean;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    dateStart: string;

    // FK
    @OneToOne(() => User, (table) => table.session, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user: User;
    @Column("integer", { nullable: false })
    userId: number;
}