-- Nuova palette dei dipendenti: niente viola del brand né colori simili a quelli di stato
-- (rosso/verde/arancio), contrasto ≥ 3:1 sia nel tema chiaro sia nello scuro.
UPDATE "User" SET "color" = CASE "color"
  WHEN '#5645d4' THEN '#687990'
  WHEN '#0075de' THEN '#2f7fd6'
  WHEN '#2a9d99' THEN '#138a84'
  WHEN '#1aae39' THEN '#7d8a1c'
  WHEN '#dd5b00' THEN '#a87a12'
  WHEN '#e03131' THEN '#d1547a'
  WHEN '#d6409f' THEN '#c03f94'
  WHEN '#8a6d3b' THEN '#94673d'
  ELSE "color"
END;
