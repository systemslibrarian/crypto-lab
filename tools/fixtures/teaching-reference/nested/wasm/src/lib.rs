// "Commented native warning is not a UI implementation."
// Primary citation already present: https://www.rfc-editor.org/rfc/rfc9106
pub fn explain_model() -> &'static str {
    r#"This native string is a candidate, not a rendered explanation."#
}
pub fn check_input() { println!("Invalid input; inspect the limits."); }
