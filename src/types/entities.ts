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

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface UserInput {
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Content {
  id: string;
  module_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ContentInput {
  module_id: string;
  title: string;
  content: string;
}

export interface ContentViewer {
  id: string;
  name: string;
  email: string;
  watched_at: string;
}
