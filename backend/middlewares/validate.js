import { validationResult } from "express-validator";

/**
 * Checks the results of the previously executed express-validator checks.
 * If there are errors → 400 + error list.
 * If no errors → next() (goes to the next middleware/route).
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array });
  }
  next();
}
