export default function SignupPage() {
  return (
    <div>
      <h1>create an account</h1>
      {/* signup form */}
      <form>
        <label>
          email:
          <input type="email" name="email" />
        </label>
        <label>
          password:
          <input type="password" name="password" />
        </label>
        <button type="submit">signup</button>
      </form>
    </div>
  );
}
