// Import Third-party Dependencies
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

// Import Internals
import { role } from "./enum/role.enum";
import { Session } from "./session.entity";

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
    createdAt: string;

    @Column("timestamp", { nullable: true })
    emailVerified: string;

    // RELATIONS
    @OneToOne(() => Session, (table) => table.user, { nullable: true })
    session: Session;
}