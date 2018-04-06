import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { BehaviorSubject } from 'rxjs/behaviorsubject'
import { Web3Service } from './web3.service'
import { range } from 'rxjs/observable/range';

const oreganoArtifacts = require('../../build/contracts/Oregano.json');
const contract = require('truffle-contract');

export class Producer {
  constructor(public id: number, public controller: string, public quotum: number) {}
}

@Injectable()
export class OreganoService {

  Oregano = contract(oreganoArtifacts);
  deployed: any;

  constructor(
    private web3: Web3Service,
    ) {
    // Bootstrap the MetaCoin abstraction for Use
    this.Oregano.setProvider(web3.web3.currentProvider);
    //this.getDeployed()
  }

  getDeployed(): Observable<any> {
    return Observable.fromPromise(this.Oregano.deployed())
  }

  getNumProducers(): Observable<any> {
    console.log('getNumProducers')
    return Observable.create(observer => {
      let meta
      console.log('inObservableCreation')
      this.Oregano
        .deployed()
        .then(instance => {
          console.log('gotInstance')
          meta = instance;
          // we use call here so the call doesn't try and write, making it free
          return meta.numProducers.call();
        })
        .then(numProducers => {
          console.log('gotNumProducers')
          observer.next(numProducers)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        })
    })
  }

  getProducers(): Observable<any> {
    console.log('getNumProducers')
    return Observable.create(observer => {
      let meta
      console.log('inObservableCreation')
      this.Oregano
        .deployed()
        .then(instance => {
          console.log('gotInstance')
          meta = instance;
          // we use call here so the call doesn't try and write, making it free
          return meta.numProducers.call();
        })
        .then(numProducers => {
          const promises = []
          for (let id = 0; id < numProducers; id++) {
            promises.push(meta.producers.call(id))
          }
          return Promise.all(promises)
        })
        .then(producers => {
          observer.next(producers)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        })
    })
  }

  // getProducer(id: number): Observable<Producer> {
  //   return this.getDeployed().map(meta => {
  //     return Observable.fromPromise<Producer>(meta.producers.call(id))
  //   }).mergeAll()
  // }

  // getProducers(): Observable<any> {
  //   return Observable.create(observer => {
  //     let meta

  //     this.Oregano
  //       .deployed()
  //       .then(instance => {
  //         meta = instance;
  //         // we use call here so the call doesn't try and write, making it free
  //         return meta.numProducers.call();
  //       })
  //       .then(numProducers => {
  //         Observable.range(0, numProducers).map(n => )
  //         observer.next(numProducers)
  //         observer.complete()
  //       })
  //       .catch(e => {
  //         console.log(e);
  //         observer.error(e)
  //       });
  //   })
  // }

  sendCoin(from, to, amount): Observable<any> {

    let meta;
    return Observable.create(observer => {
      this.Oregano
        .deployed()
        .then(instance => {
          meta = instance;
          return meta.sendCoin(to, amount, {
            from: from
          });
        })
        .then(() => {
          observer.next()
          observer.next()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

}
