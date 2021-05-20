export const findUnusedRandomId = (ids: number[], usedIds: number[]) => {
  if(usedIds.length >= ids.length) {
    return undefined;
  }

  let randomId: number;

  do {
    randomId = Math.floor( Math.random() * ids.length );
  } while( usedIds.includes(randomId) );

  return randomId;
}