-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING_PAYMENT', 'PROCESSING', 'READY', 'DELIVERED', 'REJECTED');

-- CreateTable
CREATE TABLE "document_requests" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "fee_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_logs" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "changed_by_user_id" TEXT NOT NULL,
    "old_status" "RequestStatus",
    "new_status" "RequestStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "document_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_logs" ADD CONSTRAINT "status_logs_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
