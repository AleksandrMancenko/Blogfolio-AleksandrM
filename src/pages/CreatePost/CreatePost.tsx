import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ImageUploader from '../../components/common/ImageUploader';
import styles from './CreatePost.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createNewPost,
  selectPostsLoading,
  selectPostsError,
} from '../../features/posts/postsSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

export default function CreatePost() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [lessonNum, setLessonNum] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const isLoading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  // Перенаправляем неавторизованных пользователей
  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!text.trim()) {
      errors.text = 'Content is required';
    } else if (text.trim().length < 20) {
      errors.text = 'Content must be at least 20 characters';
    }

    if (!lessonNum.trim()) {
      errors.lessonNum = 'Lesson number is required';
    } else {
      const lessonNumber = parseInt(lessonNum);
      if (isNaN(lessonNumber) || lessonNumber < 1) {
        errors.lessonNum = 'Lesson number must be a positive number';
      }
    }

    if (!image) {
      errors.image = 'Image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Валидация на стороне клиента
    if (!validateForm()) {
      return;
    }

    const lessonNumber = parseInt(lessonNum);

    try {
      await dispatch(
        createNewPost({
          title: title.trim(),
          description: description.trim(),
          text: text.trim(),
          lesson_num: lessonNumber,
          image,
        }),
      ).unwrap();

      // После успешного создания перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      // Ошибка уже обработана в Redux
      console.error('Failed to create post:', error);
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading} message="Creating post...">
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <Link to="/" className={styles.back}>
            Back to home
          </Link>
          <h1 className={styles.title}>Create New Post</h1>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div>
              <Input
                id="post-title"
                label="Title"
                type="text"
                value={title}
                onChange={setTitle}
                placeholder="Post title"
                required
                disabled={isLoading}
              />
              {validationErrors.title && (
                <div className={styles.fieldError}>{validationErrors.title}</div>
              )}
            </div>

            <div>
              <Input
                id="post-description"
                label="Description"
                type="text"
                value={description}
                onChange={setDescription}
                placeholder="Brief description"
                required
                disabled={isLoading}
              />
              {validationErrors.description && (
                <div className={styles.fieldError}>{validationErrors.description}</div>
              )}
            </div>

            <div>
              <Textarea
                id="post-text"
                label="Content"
                value={text}
                onChange={setText}
                placeholder="Write your post content here..."
                required
                disabled={isLoading}
                rows={8}
              />
              {validationErrors.text && (
                <div className={styles.fieldError}>{validationErrors.text}</div>
              )}
            </div>

            <div>
              <Input
                id="post-lesson"
                label="Lesson Number"
                type="number"
                value={lessonNum}
                onChange={setLessonNum}
                placeholder="1"
                required
                disabled={isLoading}
                min="1"
              />
              {validationErrors.lessonNum && (
                <div className={styles.fieldError}>{validationErrors.lessonNum}</div>
              )}
            </div>

            <ImageUploader
              value={image}
              onChange={setImage}
              required
              error={validationErrors.image}
              disabled={isLoading}
              maxFileSize={5 * 1024 * 1024} // 5MB
            />

            <div className={styles.submit}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </LoadingOverlay>
  );
}
