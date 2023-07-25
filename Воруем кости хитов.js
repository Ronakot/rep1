(async () => {
    async function spendHitDie(actor) {
    const classes = actor.items.filter(it => { return it.type === 'class' })
    let best = null
    classes.forEach(it => {
        const itemData = it.system
        const diceData = {
            classItem: it,
            diceUsed: itemData.hitDiceUsed,
            diceTotal: itemData.levels,
            diceRemaining: itemData.levels - itemData.hitDiceUsed,
            diceSize: parseInt(itemData.hitDice.substring(1)),
            }
        if (diceData.diceRemaining > 0 && (best === null || diceData.diceSize > best.diceSize)) {
            best = diceData
        }
    })
    if (best === null) {
        ui.notifications.error(`� ${actor.name} �� �������� ������ �����!`)
        return
    }
  
      await actor.items.get(best.classItem.id).update({ 'data.hitDiceUsed': best.diceUsed + 1 });
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `� ���� � ������� ����� ������ ${best.classItem.name}.
  �������� ������: ${best.diceRemaining - 1}/${best.diceTotal}.`,
      });
    }
  
    const selectedTokens = Array.from(game.user.targets);
  
    if (selectedTokens.length === 0) {
      ui.notifications.warn('��� ��������� ����� �������.');
      return;
    }
  
    for (const token of selectedTokens) {
      const actor = token.actor;
  
      if (actor && actor.data.type === 'character') {
        await spendHitDie(actor);
      }
    }
  })();
  
