-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'bachelor', 'supervisor');

-- CreateEnum
CREATE TYPE "DiplomaCyclePhase" AS ENUM ('preparation', 'supervisor_selection', 'topic_selection', 'post_cycle');

-- CreateEnum
CREATE TYPE "SupervisionRequestStatus" AS ENUM ('pending', 'rejected', 'accepted');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('pending', 'rejected', 'on_confirmation', 'confirmed');

-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "diploma_cycle_id" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "student_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "academic_program" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "academic_degree" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "Bachelor" (
    "bachelor_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "supervisor_id" UUID,

    CONSTRAINT "Bachelor_pkey" PRIMARY KEY ("bachelor_id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "supervisor_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "teacher_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "max_load" INTEGER NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("supervisor_id")
);

-- CreateTable
CREATE TABLE "DiplomaCycle" (
    "diploma_cycle_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "year" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "supervisor_selection_end_date" TIMESTAMP(3),
    "topic_selection_end_date" TIMESTAMP(3),
    "current_phase" "DiplomaCyclePhase" NOT NULL DEFAULT 'preparation',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DiplomaCycle_pkey" PRIMARY KEY ("diploma_cycle_id")
);

-- CreateTable
CREATE TABLE "SupervisorsInfo" (
    "supervisor_info_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supervisor_id" UUID NOT NULL,
    "comment" TEXT,
    "accept_with_topic_only" BOOLEAN NOT NULL,

    CONSTRAINT "SupervisorsInfo_pkey" PRIMARY KEY ("supervisor_info_id")
);

-- CreateTable
CREATE TABLE "SupervisionRequest" (
    "supervision_request_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bachelor_id" UUID NOT NULL,
    "supervisor_id" UUID NOT NULL,
    "comment" TEXT,
    "proposed_topic" TEXT NOT NULL,
    "status" "SupervisionRequestStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "SupervisionRequest_pkey" PRIMARY KEY ("supervision_request_id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "topic_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bachelor_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TopicStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "ArchivedBachelor" (
    "archived_bachelor_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "year" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "academic_program" TEXT NOT NULL,
    "supervisor_full_name" TEXT NOT NULL,
    "supervisor_degree" TEXT NOT NULL,
    "supervisor_position" TEXT NOT NULL,

    CONSTRAINT "ArchivedBachelor_pkey" PRIMARY KEY ("archived_bachelor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bachelor_student_id_key" ON "Bachelor"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bachelor_user_id_key" ON "Bachelor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_teacher_id_key" ON "Supervisor"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_user_id_key" ON "Supervisor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SupervisorsInfo_supervisor_id_key" ON "SupervisorsInfo"("supervisor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_bachelor_id_key" ON "Topic"("bachelor_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_diploma_cycle_id_fkey" FOREIGN KEY ("diploma_cycle_id") REFERENCES "DiplomaCycle"("diploma_cycle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bachelor" ADD CONSTRAINT "Bachelor_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bachelor" ADD CONSTRAINT "Bachelor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bachelor" ADD CONSTRAINT "Bachelor_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("supervisor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisorsInfo" ADD CONSTRAINT "SupervisorsInfo_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("supervisor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisionRequest" ADD CONSTRAINT "SupervisionRequest_bachelor_id_fkey" FOREIGN KEY ("bachelor_id") REFERENCES "Bachelor"("bachelor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisionRequest" ADD CONSTRAINT "SupervisionRequest_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("supervisor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_bachelor_id_fkey" FOREIGN KEY ("bachelor_id") REFERENCES "Bachelor"("bachelor_id") ON DELETE CASCADE ON UPDATE CASCADE;
