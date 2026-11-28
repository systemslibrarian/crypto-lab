export function migrationDates(qDay, migrationYears, shelfLifeYears) {
  if (![qDay, migrationYears, shelfLifeYears].every(Number.isSafeInteger)
    || qDay < 1 || migrationYears < 0 || shelfLifeYears < 0) return null;
  const finishByQDay = qDay - migrationYears;
  const protectLastRecord = finishByQDay - shelfLifeYears;
  if (protectLastRecord < 1) return null;
  return { finishByQDay, protectLastRecord };
}

if (typeof document !== 'undefined') {
  const controls = document.getElementById('harvest-deadlines');
  const output = document.getElementById('harvest-dates-result');
  const qDay = document.getElementById('harvest-qday');
  const migration = document.getElementById('harvest-migration');
  const shelfLife = document.getElementById('harvest-shelf-life');
  function update() {
    const dates = migrationDates(qDay.valueAsNumber, migration.valueAsNumber, shelfLife.valueAsNumber);
    output.textContent = dates
      ? `Latest start to finish migration by Q-Day: ${dates.finishByQDay}. Latest start to protect the last record for its full shelf life: ${dates.protectLastRecord}.`
      : 'Enter a positive whole calendar year and nonnegative whole durations. Both start dates must fall in year 1 or later.';
  }
  controls.addEventListener('input', update);
  update();
}
