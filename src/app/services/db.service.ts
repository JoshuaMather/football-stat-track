import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
  capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult
 } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
// import { SQLiteService } from './sqlite.service';
// import { DetailService } from './detail.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  // readonly dbName: string = 'FASdb';
  readonly dbNameCap: string = 'FASdbCap';
  readonly playersTable: string = 'playersTable';
  readonly playersStatsTable: string = 'playersStatsTable';
  readonly matchesTable: string = 'matchesTable';
  readonly bibsTable: string = 'bibsTable';
  readonly nonBibsTable: string = 'nonBibsTable';
  readonly matchPlayerStatsTable: string = 'matchPlayerStatsTable';

  public isWeb = false;

  private sqliteDB: SQLiteConnection;
  private sqlitePlugin: any;
  private db: SQLiteDBConnection;

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLiteService,
  ) {
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteDB = new SQLiteConnection(this.sqlitePlugin);
    this.createTables();
  }

  async createTables() {
    console.log('CREATE TABLES FUNCTION');
    const createTables = `
      CREATE TABLE IF NOT EXISTS ${this.playersTable} (
      playerId INTEGER PRIMARY KEY AUTOINCREMENT,
      name varchar(255),
      position varchar(255),
      dob TEXT,
      email varchar(255),
      phoneNumber varchar(255),
      subsDue INT
      );
      CREATE TABLE IF NOT EXISTS ${this.playersStatsTable} (
        playerStatsId INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId INT,
        matchesPlayed INT,
        goals INT,
        averageGoals REAL,
        assists INT,
        averageAssists REAL,
        saves INT,
        averageSaves REAL,
        averageWorkrate REAL,
        averageDefRating REAL,
        averageAttRating REAL,
        averageRating REAL,
        CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES ${this.playersTable}(playerId) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS ${this.matchesTable} (
        matchId INTEGER PRIMARY KEY AUTOINCREMENT,
        matchDate TEXT,
        matchFinishTime TEXT,
        bibsScore INT,
        nonBibsScore INT
      );
      CREATE TABLE IF NOT EXISTS ${this.bibsTable} (
        playerId INTEGER,
        matchId INTEGER,
        PRIMARY KEY (playerId, matchId),
        CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES ${this.playersTable}(playerId) ON DELETE CASCADE,
        CONSTRAINT fk_match FOREIGN KEY(matchId) REFERENCES ${this.matchesTable}(matchId) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS ${this.nonBibsTable} (
        playerId INTEGER,
        matchId INTEGER,
        PRIMARY KEY (playerId, matchId),
        CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES ${this.playersTable}(playerId) ON DELETE CASCADE,
        CONSTRAINT fk_match FOREIGN KEY(matchId) REFERENCES ${this.matchesTable}(matchId) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS ${this.matchPlayerStatsTable} (
        playerId INTEGER,
        matchId INTEGER,
        goals INT,
        assists INT,
        saves INT,
        workrate INT,
        defRating INT,
        attRating INT,
        matchRating REAL,
        PRIMARY KEY (playerId, matchId),
        CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES ${this.playersTable}(playerId) ON DELETE CASCADE,
        CONSTRAINT fk_match FOREIGN KEY(matchId) REFERENCES ${this.matchesTable}(matchId) ON DELETE CASCADE
      );
      `;
      
      if((await this.sqlite.isConnection(this.dbNameCap)).result) {
        this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
      } else {
        this.db = await this.sqliteDB.createConnection(this.dbNameCap, false, "no-encryption", 1);
      }
      
      await this.db.open();
      await this.db.execute(`PRAGMA foreign_keys = ON;`);

      // await this.db.execute(`
      // DROP TABLE ${this.bibsTable};
      // DROP TABLE ${this.nonBibsTable};
      // DROP TABLE ${this.playersStatsTable};
      // DROP TABLE ${this.matchPlayerStatsTable};
      // DROP TABLE ${this.playersTable};
      // DROP TABLE ${this.matchesTable};
      // `);
      
      await this.db.execute(createTables);
     
      // await this.db.execute(`
      // CREATE TABLE IF NOT EXISTS bibTest (
      //   playerId INTEGER,
      //   matchId INTEGER,
      //   PRIMARY KEY (playerId, matchId),
      //   CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES ${this.playersTable}(playerId) ON DELETE CASCADE,
      //   CONSTRAINT fk_match FOREIGN KEY(matchId) REFERENCES ${this.matchesTable}(matchId) ON DELETE CASCADE
      // );`);
      await this.sqlite.closeConnection(this.dbNameCap);
  }

  async addPlayer(name, position, dob, email, phoneNumber) {
    // validation
    if (!name) {
      alert('Provide a name');
      return;
    }

    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const insertPlayer = `
    INSERT INTO ${this.playersTable} (name, position, dob, email, phoneNumber, subsDue) VALUES (
      '${name}', '${position}','${dob}','${email}','${phoneNumber}', 0
      )
    `;

    const ret = await this.db.run(insertPlayer);

    // const num1 = Math.random()*10;
    // const num2 = Math.random()*10;
    // const num3 = Math.random()*10;
    // const num4 = Math.random()*10;
    // const num5 = Math.random()*10;
    // const num6 = Math.random()*10;
    // const num7 = Math.random()*10;
    // const num8 = Math.random()*10;
    // const num9 = Math.random()*10;
    // const num10 = Math.random()*10;
    // const num11 = Math.random()*10;
    // 0,0,0,0,0,0,0,0,0,0,0,
    // ${num1}, ${num2}, ${num3}, ${num4}, ${num5}, ${num6}, ${num7}, ${num8}, ${num9}, ${num10}, ${num11}
    const createStat = (
        `
      INSERT INTO ${this.playersStatsTable} (matchesPlayed, goals, averageGoals, assists, averageAssists, saves,
        averageSaves, averageWorkrate, averageDefRating, averageAttRating, averageRating, playerID) VALUES (
          0,0,0,0,0,0,0,0,0,0,0,'${ret.changes.lastId}'
        )`
    );

    await this.db.run(createStat);

    await this.sqlite.closeConnection(this.dbNameCap);

    this.navCtrl.navigateForward('players');

  }

  async getAllPlayers() {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getPlayers =`
      SELECT * FROM ${this.playersTable}
    `;

    let players = [];
    const ret = await this.db.query(getPlayers).then(res => {
      players = res.values;
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    return players;
  }

  async deletePlayer(playerId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const removePlayer =`
      DELETE FROM ${this.playersTable} WHERE playerId = ${playerId}
    `;

    await this.db.run(removePlayer);

    await this.sqlite.closeConnection(this.dbNameCap);
  }

  async updatePlayer(playerId, name, position, dob, email, phoneNumber) {
    const data = [name, position, dob, email, phoneNumber];

    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const updatePlayer =`
      UPDATE ${this.playersTable} SET name = ?, position = ?, dob = ?, email = ?, phoneNumber = ?
      WHERE playerId = ${playerId}
    `;

    await this.db.run(updatePlayer, data);

    await this.sqlite.closeConnection(this.dbNameCap);
    this.navCtrl.navigateForward('players');
  }

  async updateSubs(subs, playerId) {
    const data = [subs];

    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const updateSubs =`
      UPDATE ${this.playersTable} SET subsDue = ?
      WHERE playerId = ${playerId}
    `;

    await this.db.run(updateSubs, data);

    await this.sqlite.closeConnection(this.dbNameCap);
    this.navCtrl.navigateForward('players');
  }

  async getPlayerStats(playerId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getPlayerStats =`
      SELECT * FROM ${this.playersStatsTable} WHERE playerId = ${playerId}
    `;

    let stats;
    await this.db.query(getPlayerStats).then(res => {
      stats = res.values[0];
    });

    await this.sqlite.closeConnection(this.dbNameCap);

    return stats;
  }

  async getTotals(){
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    let totals = [];

    await this.db.query(`SELECT COUNT(matchId) FROM ${this.matchesTable}`).then(res => {
      totals.push(res.values[0]['COUNT(matchId)']);
    });
    await this.db.query(`SELECT SUM(goals) FROM ${this.playersStatsTable}`).then(res => {
      totals.push(res.values[0]['SUM(goals)']);
    });
    await this.db.query(`SELECT SUM(assists) FROM ${this.playersStatsTable}`).then(res => {
      totals.push(res.values[0]['SUM(assists)']);
    });
    await this.db.query(`SELECT SUM(saves) FROM ${this.playersStatsTable}`).then(res => {
      totals.push(res.values[0]['SUM(saves)']);
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    return totals;
  }

  async getLeaderboardStats(stat) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    await this.db.query(`SELECT * FROM ${this.matchPlayerStatsTable}`).then(res => {
      console.log(res);
    });

    await this.db.query(`SELECT * FROM ${this.playersStatsTable}`).then(res => {
      console.log(res);
    });

    const getLeaderboardStats =`
      SELECT ${this.playersTable}.playerId, name, ${stat} FROM ${this.playersTable} INNER JOIN ${this.playersStatsTable} 
        ON ${this.playersTable}.playerId=${this.playersStatsTable}.playerId 
        ORDER BY ${this.playersStatsTable}.${stat} DESC
    `;

    let leaderboardStats;
    await this.db.query(getLeaderboardStats).then(res => {
      leaderboardStats = res.values;
    });

    await this.sqlite.closeConnection(this.dbNameCap);

    return leaderboardStats;
  }

  async addMatch(matchDate, matchFinishTime, bibsScore, nonBibsScore) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const insertMatch = `
    INSERT INTO ${this.matchesTable} (matchDate, matchFinishTime, bibsScore, nonBibsScore) VALUES (
      '${matchDate}', '${matchFinishTime}','${bibsScore}','${nonBibsScore}'
      )
    `;

    const id = await this.db.run(insertMatch);

    await this.sqlite.closeConnection(this.dbNameCap);

    return id;
  }

  async addTeams(bibs, nonBibs, matchId) {
    console.log("ADD");
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);
    
    // await this.db.run(`INSERT INTO bibTest (playerId, matchId) VALUES (
    //   '${bibs[0].playerId}', '${matchId}'
    //   )`);

    let insertSQL = ``;
    bibs.forEach(player => {
      insertSQL = insertSQL + `
      INSERT INTO ${this.bibsTable} (playerId, matchId) VALUES (
        '${player.playerId}', '${matchId}'
        );`;
    });

    nonBibs.forEach(player => {
      insertSQL = insertSQL + `
      INSERT INTO ${this.nonBibsTable} (playerId, matchId) VALUES (
        '${player.playerId}', '${matchId}'
        );`;
    });

    await this.db.execute(insertSQL);
    
    await this.sqlite.closeConnection(this.dbNameCap);
  }

  async getMatches() {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getMatches =`
      SELECT * FROM ${this.matchesTable}
    `;

    let matches = [];
    const ret = await this.db.query(getMatches).then(res => {
      matches = res.values;
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    return matches;
  }

  async deleteMatch(matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    let ids = [];

    await this.db.query(`SELECT playerId FROM ${this.bibsTable} WHERE ${this.bibsTable}.matchId=${matchId}`).then(res => {
      res.values.forEach(id => {
        ids.push(id.playerId);
      });
    });
    await this.db.query(`SELECT playerId FROM ${this.nonBibsTable} WHERE ${this.nonBibsTable}.matchId=${matchId}`).then(res => {
      res.values.forEach(id => {
        ids.push(id.playerId);
      });
    });

    const removeMatch =`
      DELETE FROM ${this.matchesTable} WHERE matchId = ${matchId}
    `;

    await this.db.run(removeMatch);

    await this.sqlite.closeConnection(this.dbNameCap);

    await this.updatePlayerStats(ids);
  }

  async getMatchInfo(matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getMatchInfo =`
      SELECT * FROM ${this.matchesTable} WHERE matchId = ${matchId}
    `;

    let info;
    await this.db.query(getMatchInfo).then(res => {
      info = res.values[0];
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    
    return info;
  }

  async getTeam(teamTable, matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);


    // LOGS FOR TESTING
    // await this.db.query(`SELECT * FROM ${this.playersStatsTable}`).then(res => {
    //   console.log('STATS', res);
    // });
    // // await this.db.query(`SELECT * FROM bibTest`).then(res => {
    // //   console.log('TEST', res);
    // // });
    // await this.db.query(`SELECT * FROM ${this.bibsTable}`).then(res => {
    //   console.log('BIBS', res);
    // });
    // await this.db.query(`SELECT * FROM ${this.nonBibsTable}`).then(res => {
    //   console.log('NON BIBS', res);
    // });


    const getTeam =`
      SELECT ${this.playersTable}.playerId, name FROM ${teamTable} INNER JOIN ${this.playersTable} 
        ON ${this.playersTable}.playerId=${teamTable}.playerId 
        WHERE ${teamTable}.matchId=${matchId}
    `;

    let team;
    await this.db.query(getTeam).then(res => {
      // console.log(res);
      team = res.values;
    });

    await this.sqlite.closeConnection(this.dbNameCap);

    return team;
  }

  async editMatchInfo(matchDate, matchFinishTime, bibsScore, nonBibsScore, matchId) {
    const data = [matchDate, matchFinishTime, bibsScore, nonBibsScore];

    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const updateMatch =`
      UPDATE ${this.matchesTable} SET matchDate = ?, matchFinishTime = ?, bibsScore = ?, nonBibsScore = ?
      WHERE matchId = ${matchId}
    `;

    await this.db.run(updateMatch, data);

    await this.sqlite.closeConnection(this.dbNameCap);
  }

  async editTeams(bibs, nonBibs, matchId) {
    // as table is made up of just composite primary keys, better to remove teams for a match and then add again
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    // const removeTeam =`
    //   DELETE FROM ${this.bibsTable} WHERE matchId = ${matchId};
    //   DELETE FROM ${this.nonBibsTable} WHERE matchId = ${matchId};
    // `;

    await this.db.run(`DELETE FROM ${this.bibsTable} WHERE matchId = ${matchId};`).then(res => {
      console.log(res);
    });
    await this.db.run(`DELETE FROM ${this.nonBibsTable} WHERE matchId = ${matchId};`).then(res => {
      console.log(res);
    });
    console.log("DELETED");

    await this.sqlite.closeConnection(this.dbNameCap);
    await this.addTeams(bibs, nonBibs, matchId);
  }

  async editMatchPlayerStats(playerStats, matchId) {
    console.log(playerStats);
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);
    
    let ids = [];
    let updateMatchPlayerStats = ``;
    playerStats.forEach(stats => {
      ids.push(stats.playerId);
      updateMatchPlayerStats = updateMatchPlayerStats + `
      UPDATE ${this.matchPlayerStatsTable} SET
      goals = '${stats.goals}', 
      assists = '${stats.assists}',
      saves = '${stats.saves}',
      workrate = '${stats.workrate}',
      defRating = '${stats.defRating}',
      attRating = '${stats.attRating}',
      matchRating = '${stats.matchRating}'
      WHERE matchId = '${matchId}' AND playerId = '${stats.playerId}';`;
    });

    await this.db.execute(updateMatchPlayerStats);
    
    await this.sqlite.closeConnection(this.dbNameCap);

    await this.updatePlayerStats(ids);
  }

  async addMatchPlayerStats(playerStats, matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);
    
    let ids = [];
    let insertMatchPlayerStats = ``;
    playerStats.forEach(stats => {
      ids.push(stats.playerId);
      insertMatchPlayerStats = insertMatchPlayerStats + `
      INSERT INTO ${this.matchPlayerStatsTable} (playerId, matchId, goals, assists, saves, workrate, defRating, attRating, matchRating) VALUES (
        '${stats.playerId}', '${matchId}', '${stats.goals}', '${stats.assists}', '${stats.saves}', '${stats.workrate}', '${stats.defRating}', '${stats.attRating}', '${stats.matchRating}'
        );`;
    });

    await this.db.execute(insertMatchPlayerStats);
    
    await this.sqlite.closeConnection(this.dbNameCap);

    await this.updatePlayerStats(ids);
  }

  async updatePlayerStats(ids) {
    // Use match player stats table to get total/average stats
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    let updatePlayerStats = ``;

    ids.forEach(id => {
      updatePlayerStats = updatePlayerStats + (
        `
      UPDATE ${this.playersStatsTable} SET
        matchesPlayed = (SELECT COUNT(playerId) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        goals = (SELECT SUM(goals) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageGoals = (SELECT round(AVG(goals),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        assists = (SELECT SUM(assists) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageAssists = (SELECT round(AVG(assists),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        saves = (SELECT SUM(saves) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageSaves = (SELECT round(AVG(saves),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageWorkrate = (SELECT round(AVG(workrate),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageDefRating = (SELECT round(AVG(defRating),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageAttRating = (SELECT round(AVG(attRating),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id}),
        averageRating = (SELECT round(AVG(matchRating),2) FROM ${this.matchPlayerStatsTable} WHERE playerId = ${id})
        WHERE playerId = '${id}'
        ;`
      );
    });
    
    await this.db.execute(updatePlayerStats).catch(e => {
      console.log(e);
    });
    
    await this.sqlite.closeConnection(this.dbNameCap);
  }

  async getAverageStats() {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getAverageStats =`
      SELECT AVG(averageRating), AVG(averageGoals), AVG(averageAssists), AVG(averageSaves), AVG(averageWorkrate), AVG(averageDefRating), AVG(averageAttRating) 
        FROM ${this.playersStatsTable}
    `;

    let averageStats;
    await this.db.query(getAverageStats).then(res => {
      averageStats = res.values[0];
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    
    return averageStats;
  }

  async getMatchTopStats(matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    let matchTopStats = [];

    await this.db.query(`
    SELECT name, MAX(matchRating) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      matchRating=(SELECT MAX(matchRating) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(goals) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      goals=(SELECT MAX(goals) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(assists) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      assists=(SELECT MAX(assists) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(saves) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      saves=(SELECT MAX(saves) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(workrate) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      workrate=(SELECT MAX(workrate) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(defRating) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      defRating=(SELECT MAX(defRating) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });

    await this.db.query(`
    SELECT name, MAX(attRating) FROM ${this.matchPlayerStatsTable}
    INNER JOIN ${this.playersTable} ON ${this.playersTable}.playerId=(
      SELECT playerId FROM ${this.matchPlayerStatsTable} WHERE
      attRating=(SELECT MAX(attRating) FROM ${this.matchPlayerStatsTable} WHERE matchID=${matchId}) 
    ) WHERE matchId=${matchId}
    ;`).then(res => {
      matchTopStats.push(res.values[0]);
    });
    

    console.log(matchTopStats);

    await this.sqlite.closeConnection(this.dbNameCap);
    
    return matchTopStats;
  }

  async getMatchPlayerStats(matchId) {
    if((await this.sqlite.isConnection(this.dbNameCap)).result) {
      this.db = await this.sqlite.retrieveConnection(this.dbNameCap);
    } else {
      this.db = await this.sqlite.createConnection(this.dbNameCap, false, "no-encryption", 1);
    }
    await this.db.open();
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    const getMatchPlayerStats =`
      SELECT * FROM ${this.matchPlayerStatsTable} WHERE matchId = ${matchId}
    `;

    let matchPlayerStats;
    await this.db.query(getMatchPlayerStats).then(res => {
      matchPlayerStats = res.values;
    });

    await this.sqlite.closeConnection(this.dbNameCap);
    
    return matchPlayerStats;
  }
}
