import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import styles from './CreatePost.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createNewPost, selectPostsLoading, selectPostsError } from '../../features/posts/postsSlice';
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

  const isLoading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  // Перенаправляем неавторизованных пользователей
  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!title.trim()) {
      return;
    }
    if (!description.trim()) {
      return;
    }
    if (!text.trim()) {
      return;
    }
    if (!lessonNum.trim()) {
      return;
    }

    const lessonNumber = parseInt(lessonNum);
    if (isNaN(lessonNumber) || lessonNumber < 1) {
      return;
    }

    try {
      await dispatch(createNewPost({
        title: title.trim(),
        description: description.trim(),
        text: text.trim(),
        lesson_num: lessonNumber,
        image,
      })).unwrap();
      
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
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

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

            <div className={styles.fileInput}>
              <label htmlFor="post-image" className={styles.fileLabel}>
                Image (optional)
              </label>
              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className={styles.fileInputField}
              />
              {image && (
                <div className={styles.fileInfo}>
                  Selected: {image.name}
                </div>
              )}
            </div>

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
