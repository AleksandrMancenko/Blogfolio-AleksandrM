import { useState, FormEvent, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import styles from "./SignUp.module.css";

export default function SignUp() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");

  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [passErr,  setPassErr]  = useState<string | undefined>();

  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const okPass = pass.length >= 6 && pass === pass2;
    return name.trim().length > 0 && okEmail && okPass;
  }, [name, email, pass, pass2]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Invalid email"); ok = false; }
    else setEmailErr(undefined);

    if (pass.length < 6 || pass !== pass2) { setPassErr("Passwords must match (min 6 chars)"); ok = false; }
    else setPassErr(undefined);

    if (!ok) return;

    // TODO: submit to API
    navigate("/success", { state: { name } });
  };

  return (
    <section className={styles.screen}>
      <div className={styles.wrap}>
        <Link to="/" className={styles.back}>Back to home</Link>
        <h1 className={styles.title}>Sign Up</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Input id="su-name"  label="Name"     value={name}  onChange={setName}  placeholder="Your name" required />
          <Input id="su-email" label="Email"    type="email"  value={email} onChange={setEmail} placeholder="Your email" required errorText={emailErr}/>
          <Input id="su-pass"  label="Password" type="password" value={pass} onChange={setPass} placeholder="Your password" required />
          <Input id="su-pass2" label="Confirm password" type="password" value={pass2} onChange={setPass2} placeholder="Confirm password" required errorText={passErr} />

          <div className={styles.submit}>
            <Button type="submit" variant="primary" disabled={!canSubmit}>Sign Up</Button>
          </div>

          <div className={styles.note}>
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
