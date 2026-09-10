ALTER TABLE "audit_logs" RENAME COLUMN "previous_status" TO "from_status";--> statement-breakpoint
ALTER TABLE "audit_logs" RENAME COLUMN "new_status" TO "to_status";--> statement-breakpoint
ALTER TABLE "audit_logs" RENAME COLUMN "actor" TO "user_id";--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "from_status" SET DATA TYPE varchar(20) USING "from_status"::varchar(20);--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "to_status" SET DATA TYPE varchar(20) USING "to_status"::varchar(20);--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");