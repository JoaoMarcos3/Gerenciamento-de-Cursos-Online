export interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Module {
  id: string;
  course_id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CourseInput {
  code: string;
  title: string;
  description: string | null;
  user_id: string;
}

export interface ModuleInput {
  course_id: string;
  user_id: string;
  title: string;
  description: string | null;
}
